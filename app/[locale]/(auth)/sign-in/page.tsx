import { LoginComponent } from "./components/LoginComponent";

const SignInPage = async () => {
  const title = `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`;

  return (
    <div className="h-full">
      <div className="py-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
      </div>
      <div>
        <LoginComponent />
      </div>
    </div>
  );
};

export default SignInPage;
