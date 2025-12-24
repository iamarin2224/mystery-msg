import { Body, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://mystery-message.vercel.app"
    : "http://localhost:3000";

const VerificationEmail = ({ username = "Sample", otp = "123456" }: VerificationEmailProps) => {
  const company = "Mystery Message"
  return (
    <Html>
      <Head />
      <Preview>Here is your verification code: {otp}</Preview>
      <Tailwind>
        <Body className="bg-black m-auto font-sans">
          <Container className="mb-10 mx-auto p-5 max-w-116.25">
            <Section
              className="mt-10 mx-auto"
              style={{
                width: "120px",
                height: "1px",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <Img
                src={`${baseUrl}/mystryMsg.png`}
                alt="Mystery Message Logo"
                style={{
                  width: "120px",
                  height: "auto",
                  display: "block",
                  borderRadius: "8px",
                }}
              />
            </Section>
            <Heading className="text-2xl text-white font-normal text-center p-0 my-8 mx-0">
              Welcome to <strong>{company}</strong>, {username}!
            </Heading>
            <Text className="text-start text-sm text-white">
              Hello {username},
            </Text>
            <Text className="text-start text-sm text-white leading-relaxed">
              Thank you for registering. We hope you enjoy your journey with us. Please use the following verification code to complete your registration:
            </Text>
            <Text className="text-center text-2xl tracking-widest text-white leading-relaxed">{otp}</Text>
            <Text className="text-start text-sm text-white">
              Cheers,
              <br />
              The {company} Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;