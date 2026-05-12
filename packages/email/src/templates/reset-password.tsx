import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  name: string;
  resetUrl: string;
}

export function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your OptimListing password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Section style={section}>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              We received a request to reset your password. Click the button below to create a new password:
            </Text>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
            <Text style={text}>
              This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </Text>
            <Text style={footer}>
              If the button doesn't work, copy and paste this URL into your browser:
            </Text>
            <Text style={link}>{resetUrl}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f9fafb",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 20px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827",
  marginBottom: "24px",
};

const section = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "32px",
  border: "1px solid #e5e7eb",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  marginBottom: "16px",
};

const button = {
  backgroundColor: "#0284c7",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "16px",
  marginBottom: "24px",
};

const footer = {
  fontSize: "14px",
  color: "#9ca3af",
  marginTop: "24px",
  borderTop: "1px solid #e5e7eb",
  paddingTop: "16px",
};

const link = {
  fontSize: "12px",
  color: "#6b7280",
  wordBreak: "break-all" as const,
};
