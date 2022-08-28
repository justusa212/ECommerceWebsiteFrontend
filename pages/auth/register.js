import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";

const createUserSchema = object({
  name: string().min(1, "Name is required"),
  password: string()
    .min(6, "Password too short - should be 6 chars minimum")
    .min(1, "Password is required",),
  passwordConfirmation: string().min(1,"passwordConfirmation is required"),
  email: string({
    required_error: "Email is required",
  })
    .email("Not a valid email")
    .min(1,"Password is required"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

function RegisterPage() {
  const router = useRouter();
  const [ registerError, setRegisterError ] = useState(null);
  const {register, formState: { errors }, handleSubmit,} = useForm({resolver: zodResolver(createUserSchema),});

  async function onSubmit(values) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values
      );
      router.push("/");
    } catch (e) {
      setRegisterError(e.message);
    }
  }

  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
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
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            {...register("name")}
          />
          <p>{errors.name?.message}</p>
        </div>

        <div className="form-element">
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

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Confirm password</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="*********"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            {...register("passwordConfirmation")}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit" className="px-4 py-2 rounded bg-blue-400 text-white hover:bg-blue-700 my-4 w-full">REGISTER</button>
      </form>
    </div>
  );
}

export default RegisterPage;