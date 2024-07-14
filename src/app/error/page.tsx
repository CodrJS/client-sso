"use client";
import Page from "@/components/Page";
import { useFlowError } from "@/contexts/ErrorFlowContext";

export default function ErrorPage() {
  const [error] = useFlowError();

  return <Page>{JSON.stringify(error, null, 2)}</Page>;
}
