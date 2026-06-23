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

interface ResetEmailProps {
  name: string;
  resetUrl: string;
}

export const ResetPasswordEmail = ({ name, resetUrl }: ResetEmailProps) => (
  <Tailwind>
    <Html>
      <Head>
        <EmailFonts />
      </Head>

      <Body className="bg-[#070B18] m-0 font-sans text-center">
        <Preview>Reset your OptimListing password</Preview>
        <Container className="mx-auto my-8 mobile:mt-0 w-full max-w-[640px]">
          <Section>
            <Section className="bg-[#111827] mb-4 px-5 pt-5 pb-14 rounded-[10px]">
              <Section className="mx-auto max-w-[422px] text-center">
                <Text className="mt-0 mb-6 font-13 font-sans text-[#8899BB]">
                  OptimListing
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
                  Reset your password
                </Heading>
                <Text className="m-0 mb-8 max-w-[400px] font-16 font-sans text-[#8899BB]">
                  Someone has requested a link to change your password, and you
                  can do this through the link below.
                </Text>
              </Section>

              <Section className="mb-6 text-center">
                <Button
                  href={resetUrl}
                  className="inline-block bg-[#14171E] px-7 py-4 rounded-lg font-16 font-sans text-[#EEF2FF] text-center leading-6"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
                >
                  Change password
                </Button>
              </Section>

              <Text className="font-13 text-[#8899BB] mx-auto mt-8 mb-0 max-w-[400px] text-center font-sans">
                If you didn&apos;t request this, please ignore this email.
                Your password won&apos;t change until you access the link
                above and create a new one.
              </Text>
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

export default ResetPasswordEmail;
