import Button from "./Button";
import Input from "./Input";

export default function CodeFlow() {
  return (
    <>
      <Input name="code" label="Code" />
      <Input name="method" label="" type="hidden" value="code" />
      <Button
        type="submit"
        name="resend"
        value="code"
        link
        className="my-4"
        center={false}
      >
        Resend Code
      </Button>
      <Button type="submit" name="method" value="code" primary>
        Submit
      </Button>
    </>
  );
}
