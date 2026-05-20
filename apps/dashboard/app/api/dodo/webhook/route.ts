import { Webhooks } from "@dodopayments/nextjs";
import { prisma } from "@optimlisting/db";

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET!,

  onSubscriptionActive: async (payload) => {
    const subscription = payload.data;
    const userId = subscription.metadata?.userId || payload.data?.metadata?.userId;

    // Validate userId exists before upserting
    if (!userId) {
      console.error("[Dodo Webhook] Missing userId in subscription metadata:", {
        subscriptionId: subscription.subscription_id,
        metadata: subscription.metadata,
        payloadMetadata: payload.data?.metadata,
      });
      return;
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error("[Dodo Webhook] User not found:", {
        userId,
        subscriptionId: subscription.subscription_id,
      });
      return;
    }

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: (subscription.metadata?.plan as any) || "STARTER",
        status: "ACTIVE",
        paymentSubscriptionId: subscription.subscription_id,
        paymentCustomerId: subscription.customer?.customer_id,
        currentPeriodStart: subscription.previous_billing_date
          ? new Date(subscription.previous_billing_date)
          : undefined,
        currentPeriodEnd: subscription.next_billing_date
          ? new Date(subscription.next_billing_date)
          : undefined,
        canceledAt: null,
      },
      create: {
        userId,
        plan: (subscription.metadata?.plan as any) || "STARTER",
        status: "ACTIVE",
        paymentSubscriptionId: subscription.subscription_id,
        paymentCustomerId: subscription.customer?.customer_id,
        currentPeriodStart: subscription.previous_billing_date
          ? new Date(subscription.previous_billing_date)
          : undefined,
        currentPeriodEnd: subscription.next_billing_date
          ? new Date(subscription.next_billing_date)
          : undefined,
      },
    });

    console.log("[Dodo Webhook] Subscription activated:", { userId, plan: subscription.metadata?.plan });
  },

  onSubscriptionCancelled: async (payload) => {
    const subscriptionId = payload.data.subscription_id;
    
    if (!subscriptionId) {
      console.error("[Dodo Webhook] Missing subscription_id in cancellation");
      return;
    }

    await prisma.subscription.updateMany({
      where: { paymentSubscriptionId: subscriptionId },
      data: {
        status: "CANCELED",
        plan: "FREE",
        canceledAt: new Date(),
      },
    });

    console.log("[Dodo Webhook] Subscription cancelled:", { subscriptionId });
  },

  onSubscriptionUpdated: async (payload) => {
    const subscription = payload.data;

    const statusMap: Record<string, string> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      cancelled: "CANCELED",
      expired: "CANCELED",
      unpaid: "PAST_DUE",
      pending: "ACTIVE",
      on_hold: "PAST_DUE",
      failed: "PAST_DUE",
    };

    const mappedStatus = statusMap[subscription.status] || "ACTIVE";

    // If the subscription fully expired, downgrade to FREE
    const updateData: any = {
      status: mappedStatus,
      currentPeriodStart: subscription.previous_billing_date
        ? new Date(subscription.previous_billing_date)
        : undefined,
      currentPeriodEnd: subscription.next_billing_date
        ? new Date(subscription.next_billing_date)
        : undefined,
    };

    // When subscription fully expires, reset to FREE plan
    if (subscription.status === "expired" || subscription.status === "cancelled") {
      updateData.plan = "FREE";
    }

    await prisma.subscription.updateMany({
      where: { paymentSubscriptionId: subscription.subscription_id },
      data: updateData,
    });

    console.log("[Dodo Webhook] Subscription updated:", {
      status: mappedStatus,
      subscriptionId: subscription.subscription_id,
    });
  },
});
