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

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to OptimListing — start optimizing your marketplace listings</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to OptimListing! 🚀</Heading>
          <Section style={section}>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thanks for joining OptimListing. You're now ready to optimize your marketplace listings with AI.
            </Text>
            <Text style={text}>Here's how to get started:</Text>
            <Text style={listItem}>1. Go to the Optimize page</Text>
            <Text style={listItem}>2. Paste your listing title, description, and tags</Text>
            <Text style={listItem}>3. Get AI-optimized content in seconds</Text>
            <Button style={button} href="https://optimlisting.com/dashboard/sign-in">
              Start Optimizing
            </Button>
            <Text style={footer}>
              If you have any questions, reply to this email — we're here to help.
            </Text>
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

const listItem = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  marginBottom: "8px",
  paddingLeft: "8px",
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
