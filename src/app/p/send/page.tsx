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

export default function SendPage() {
  const { handleSubmit } = useForm();
  const fileRef = useRef<File>();

  const onSubmit = async (data: any) => {
    const file = fileRef.current;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    OracleTrackAuthenticatedApi.post("sms/upload", formData, {
      headers: { "Content-Type": "application/octet-stream" },
    })
      .then(() => {
        alert("Success");
      })
      .catch((err) => {
        console.error(err);
        alert("Error");
      });
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
                  id="name"
                  type="text"
                  className="w-full"
                  defaultValue="Gamer Gear Pro Controller"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Text</Label>
                <Textarea
                  id="description"
                  maxLength={160}
                  defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                  className="min-h-32"
                />
              </div>
              <CSVUpload
                setFile={(file) => {
                  fileRef.current = file;
                }}
              />
              <Button>Enviar</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
