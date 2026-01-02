import { Body, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const ForgotPassVerification = ({ username = "Sample", otp = "123456" }: VerificationEmailProps) => {
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
                src="https://res.cloudinary.com/dtifoskmg/image/upload/v1766647632/mystryMsg_j6rsk5.png"
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
              Reset your <strong>{company}</strong> password, {username}
            </Heading>
            <Text className="text-start text-sm text-white">
              Hello {username},
            </Text>
            <Text className="text-start text-sm text-white leading-relaxed">
              We received a request to reset the password for your {company} account. Please use the verification code below to continue with resetting your password.
            </Text>
            <Text className="text-center text-2xl tracking-widest text-white leading-relaxed">{otp}</Text>
            <Text className="text-start text-sm text-white leading-relaxed">
              Please note that the verification code will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email.
            </Text>
            <Text className="text-start text-sm text-white">
              Cheers,
              <br />
              The {company} Team,
              <br/>
              Made with ❤️ by Arin
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ForgotPassVerification;