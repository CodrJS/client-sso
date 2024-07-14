import Button from "../Button";

export default function LoginChoice({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      <Button
        primary
        className="mt-4"
        type="submit"
        name="method"
        value="code"
        disabled={isLoading}
      >
        Login with code
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-900">Or</span>
        </div>
      </div>
      <Button
        primary
        type="submit"
        name="method"
        value="webauthn"
        disabled={isLoading}
      >
        Use security key
      </Button>
    </>
  );
}
