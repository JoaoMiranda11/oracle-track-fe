"use client";

import CSVUpload from "@/components/inputs/csvInput";
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
import { Textarea } from "@/components/ui/textarea";
import OracleTrackAuthenticatedApi from "@/services/instances/oracle-track.api.authenticated";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface MessageForm {
  message: string;
  file: any;
  title: string;
}

export default function SendPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageForm>();
  const fileRef = useRef<File>();

  const onSubmit = async (data: MessageForm) => {
    const file = fileRef.current;
    if (!file) {
      alert("Arquivo não encontrado!");
      return;
    }

    console.log(data)

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", data.title);
    formData.append("message", data.message);

    try {
      await OracleTrackAuthenticatedApi.post("sms/upload", formData, {
        headers: { "Content-Type": "application/octet-stream" },
      });
      alert("Success");
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card x-chunk="dashboard-07-chunk-0">
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
              <Button type="submit">Enviar</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
