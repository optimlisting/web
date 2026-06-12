import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { EmailFonts } from '../theme-fonts';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Tailwind>
    <Html>
      <Head>
        <EmailFonts />
      </Head>

      <Body className="bg-[#070B18] m-0 font-sans text-center">
        <Preview>Welcome to OptimListing — start optimizing your marketplace listings</Preview>
        <Container className="mx-auto my-8 mobile:mt-0 w-full max-w-[640px]">
          <Section>
            <Section className="bg-[#111827] mb-4 px-5 pt-5 pb-14 rounded-[10px]">
              <Section className="mx-auto max-w-[422px] text-center">
                <Text className="mt-0 mb-6 font-13 font-sans text-[#8899BB]">
                  Thanks for joining us
                </Text>
                <Img
                  src={`https://www.optimlisting.com/optim-logo.png`}
                  alt=""
                  width={50}
                  className="mx-auto mb-6"
                />
                <Heading
                  as="h1"
                  className="mt-0 mb-6 font-40 font-sans text-[#EEF2FF]"
                >
                  Welcome to OptimListing
                </Heading>
                <Text className="m-0 font-16 font-sans text-[#8899BB]">
                  Hey {name}, you&apos;re all set. Open your dashboard to start optimizing your marketplace listings with AI.
                </Text>
              </Section>

              <Section className="px-6 mt-12">
                <Heading
                  as="h2"
                  className="mt-0 mb-10 font-32 font-sans text-[#EEF2FF]"
                >
                  Getting started
                </Heading>
                <Section className="mb-10">
                  <Row className="mb-3">
                    <Text className="m-0 font-16 font-sans text-[#8899BB] text-left">
                      <span className="mr-3 inline-block border-stroke-strong border border-solid rounded-full size-2 align-middle" />
                      Head over to the Settings page in the app and select your desired marketplace
                    </Text>
                  </Row>
                  <Row className="mb-3">
                    <Text className="m-0 font-16 font-sans text-[#8899BB] text-left">
                      <span className="mr-3 inline-block border-stroke-strong border border-solid rounded-full size-2 align-middle" />
                      Go to the Optimize page
                    </Text>
                  </Row>
                  <Row className="mb-3 text-left">
                    <Text className="m-0 font-16 font-sans text-[#8899BB] text-left">
                      <span className="mr-3 inline-block border-stroke-strong border border-solid rounded-full size-2 align-middle" />
                      Paste your listing title, description, and tags
                    </Text>
                  </Row>
                  <Row className="mb-3 text-left">
                    <Text className="m-0 font-16 font-sans text-[#8899BB] text-left">
                      <span className="mr-3 inline-block border-stroke-strong border border-solid rounded-full size-2 align-middle" />
                      Get AI-optimized content in seconds
                    </Text>
                  </Row>
                </Section>
                <Section className="text-center">
                  <Button
                    href={`https://www.optimlisting.com/dashboard/sign-in`}
                    className="inline-block bg-[#14171E] px-7 py-4 rounded-lg font-16 font-sans text-[#EEF2FF] text-center leading-6"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
                  >
                    Open dashboard
                  </Button>
                </Section>
              </Section>
            </Section>

            {/* Footer */}
            <Section>
              <Row>
                <Column className="px-6 py-3 text-center">
                  <Text className="mx-auto mt-0 mb-6 sm:max-w-md font-13 font-sans text-[#8899BB] text-center">
                    If you have any questions, you can always reach us at <a className="text-[#8899BB] underline-offset-4" href={`mailto:support@optimlisting.com`} target="_blank">support@optimlisting.com</a> we're here to help.
                  </Text>

                  <Section className="mb-8">
                    <Link
                      href="https://x.com/optimlisting"
                      className="inline-block px-2 align-middle"
                    >
                      <Img
                        src={`https://www.optimlisting.com/social-x-logo.png`}
                        alt="X"
                        width={18}
                        className="block"
                      />
                    </Link>
                    <Link
                      href="https://www.linkedin.com/company/optimlisting"
                      className="inline-block px-2 align-middle"
                    >
                      <Img
                        src={`https://www.optimlisting.com/social-in-logo.png`}
                        alt="LinkedIn"
                        width={18}
                        className="block"
                      />
                    </Link>
                  </Section>
                </Column>
              </Row>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default WelcomeEmail;
