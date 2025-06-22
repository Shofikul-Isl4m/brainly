import { Card } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
    ConfirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
  })
  .refine((data) => data.newPassword === data.ConfirmPassword, {
    message: "Confirm password must match newPassword",
    path: ["ConfirmPassword"],
  });
type formValues = z.infer<typeof formSchema>;

const Profile = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const rawToken = localStorage.getItem("token");
  const token = rawToken && rawToken != "null" ? JSON.parse(rawToken) : null;

  const [user, setUser] = useState<{
    username?: string;
    email?: string;
    posts?: string;
  }>({});

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    axios
      .get(`${API_BASE}/user`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setUser(res.data))
      .catch((res) => console.log(res));
  });

  const onSubmit = (values: formValues) => {
    if (!token) {
      return;
    }
    axios
      .put(
        `${API_BASE}/changePassword`,
        { ...values },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(() => toast.success("password changed Successfully"))
      .catch(() => toast.error("wrong user password"));
    form.reset();
  };
  return (
    <div className="flex justify-center items-center flex-col h-[90vh]">
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="p-6 w-72 sm:w-96">
        <h1>Username : {user.username}</h1>
        <h1>Email : {user.email}</h1>
        <h1>Total Saved Posts : {user.posts}</h1>
      </Card>
      <Card className="px-6 gap-4 mt-10 w-72 sm:w-96">
        <h1 className="text-3xl my-4">Change Password </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="OldPassword"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="NewPassword"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ConfirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="ConfirmPassword"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer w-full my-2">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
