"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { APP_NAME, C, FONT_DISPLAY, FONT_SANS } from "@/constants";
import { isSupabaseConfigured } from "@/lib/env";
import { Button, Card, Field, Input } from "@/components/ui";
import { credentialsSchema, type CredentialsInput } from "../schemas";
import { useLogin, useSignup } from "../hooks/useAuthMutations";

type Mode = "login" | "signup";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [notice, setNotice] = useState<string | null>(null);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<CredentialsInput>({ resolver: zodResolver(credentialsSchema) });

  const login = useLogin();
  const signup = useSignup();
  const pending = login.isPending || signup.isPending;
  const errorMessage = (login.error || signup.error) as Error | null;

  const onSubmit = (values: CredentialsInput) => {
    setNotice(null);
    if (mode === "login") {
      login.mutate(values);
    } else {
      signup.mutate(values, {
        onSuccess: ({ needsConfirmation }) => {
          if (needsConfirmation) {
            setNotice("Conta criada. Confirme o e-mail para entrar.");
            setMode("login");
          }
        },
      });
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.paper, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16, fontFamily: FONT_SANS,
    }}>
      <Card style={{ padding: 28, width: 380, maxWidth: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, background: C.emerald,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Landmark size={18} color={C.white} />
          </div>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.ink, fontSize: 18 }}>
            {APP_NAME}
          </span>
        </div>

        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.ink, margin: "0 0 4px" }}>
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p style={{ fontSize: 13, color: C.slateSoft, marginTop: 0, marginBottom: 20 }}>
          Controle financeiro multi-moeda.
        </p>

        {!isSupabaseConfigured && (
          <div style={{ fontSize: 12.5, color: C.coral, background: C.coralSoft, padding: 10, borderRadius: 9, marginBottom: 16 }}>
            Supabase não configurado. Preencha o arquivo .env.local para habilitar o login.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="E-mail" error={errors.email?.message}>
            <Input type="email" autoComplete="email" placeholder="voce@email.com" {...register("email")} />
          </Field>
          <Field label="Senha" error={errors.password?.message}>
            <Input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••"
              {...register("password")}
            />
          </Field>

          {errorMessage && (
            <div style={{ fontSize: 12.5, color: C.coral, marginBottom: 12 }}>{errorMessage.message}</div>
          )}
          {notice && <div style={{ fontSize: 12.5, color: C.emerald, marginBottom: 12 }}>{notice}</div>}

          <Button type="submit" disabled={pending} style={{ width: "100%", justifyContent: "center" }}>
            {pending ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setNotice(null); }}
          style={{
            marginTop: 16, background: "none", border: "none", cursor: "pointer",
            color: C.steel, fontSize: 13, fontFamily: FONT_SANS, width: "100%",
          }}
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </Card>
    </div>
  );
}
