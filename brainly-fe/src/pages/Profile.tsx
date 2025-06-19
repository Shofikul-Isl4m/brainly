import { Card } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const rawToken = localStorage.getItem("token");
  const token = rawToken && rawToken != "null" ? JSON.parse(rawToken) : null;
  const form = useForm();
  const [user, setUser] = useState<{
    username?: string;
    email?: string;
    posts?: string;
  }>({});

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

  const onSubmit = () => {};
  return (
    <div className="flex justify-center items-center flex-col h-[90vh]">
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="p-6 w-72 sm:w-96">
        <h1>Username : {user.username}</h1>
        <h1>Email : {user.email}</h1>
        <h1>Total Saved Posts : {user.posts}</h1>
      </Card>
      <Card className="px-6 gap-4 mt-10 w-72 sm:w-96">
        <h1 className="text-3xl">Change Password </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
              name="NewPassword"
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
            <Button type="submit" className="cursor-pointer"></Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
