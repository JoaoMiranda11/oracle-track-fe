"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useNotification } from "@/contexts/client/notification/notification.context";
import {
  WsEventsClient,
  WsEventsServer,
} from "@/contexts/client/notification/ws.enum";
import OracleTrackAuthenticatedApi from "@/services/instances/oracle-track.api.authenticated";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MessageForm {
  message: string;
  file: any;
  title: string;
}

const defaultProgress = { value: 0, message: "" };
export default function SendPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageForm>();
  const fileRef = useRef<File>();
  const { connected, on } = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(defaultProgress);

  const onSubmit = (data: MessageForm) => {
    const file = fileRef.current;
    if (!file) {
      toast.error("Arquivo não encontrado!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", data.title);
    formData.append("message", data.message);

    setLoading(true);
    OracleTrackAuthenticatedApi.post("sms/upload", formData, {
      headers: { "Content-Type": "application/octet-stream" },
    })
      .then((res) => {
        toast.success("Success");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error");
      })
      .finally(() => {
        setLoading(false);
        setStep(defaultProgress);
      });
  };

  useEffect(() => {
    if (connected) {
      on<{ step: number }>(WsEventsServer.FEEDBACK_SEND_SMS, (res) => {
        setStep({ value: res.metadata?.step ?? 0, message: res.msg ?? "" });
      });
    }
  }, [connected]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card x-chunk="dashboard-07-chunk-0" className="relative">
          {loading && (
            <div className="absolute flex justify-center items-center flex-col gap-2 rounded-lg z-30 w-full h-full bg-primary-theme">
              <Progress value={step.value} className="w-[60%]" />
              <span>{step.message}</span>
            </div>
          )}

          <CardHeader>
            <CardTitle>Enviar SMS</CardTitle>
            <CardDescription>
              Envie rápido, prático e no melhor preço.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Title</Label>
                <Input
                  id="title"
                  type="text"
                  className="w-full"
                  {...register("title", { required: true })}
                />
                {errors.title && <span>Title is required</span>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Text</Label>
                <Textarea
                  id="message"
                  maxLength={160}
                  className="min-h-20 max-h-40"
                  {...register("message", { required: true })}
                />
                {errors.message && <span>Text is required</span>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="csv">CSV File</Label>
                <Input
                  id="csv"
                  type="file"
                  onChange={(ev) => {
                    fileRef.current = ev.target?.files?.[0];
                  }}
                />
              </div>
              <Button disabled={loading} type="submit">
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
