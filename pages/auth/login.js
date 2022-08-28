import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";

const createSessionSchema = object({
  email: string().min(1,
    "Email is required",
  ),
  password: string().min(1,
    "Password is required",
  ),
});

function LoginPage() {
  const router = useRouter();
  const [ loginError, setLoginError ] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        { withCredentials: true }
      );
      router.push("/");
    } catch (e) {
      setLoginError(e.message);
    }
  }

  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
      <p>{loginError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>
        </div>

        <div className="mb-6">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="*********"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
        </div>

        <button type="submit" className="px-4 py-2 rounded bg-blue-400 text-white hover:bg-blue-700 my-4 w-full">LOGIN</button>
      </form>
    </div>
  );
}

export default LoginPage;