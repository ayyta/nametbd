"use client";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

// Schema validation using Zod
const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
});

export default function Popup({ setIsPopupOpen }) {
    // Initialize the form with useForm hook
    const { control, handleSubmit, getValues } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(fieldType) {
        switch (fieldType) {
            case "username":
                console.log("Username:", getValues("username")); // Logs current username
                break;
            case "email":
                console.log("Email:", getValues("email")); // Logs current email
                break;
            case "password":
                console.log("Password:", getValues("password")); // Logs current password
                break;
            default:
                console.log("Unknown field");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Label className="text-4xl">My Account</Label>
            <Card className="w-[75vw] h-[90vh] border-none flex flex-col rounded-t-3xl bg-[#313131]">
                <CardHeader className="bg-blue-500 rounded-t-3xl h-48 flex items-end">
                    <Cross2Icon
                        className="w-9 h-9 cursor-pointer"
                        onClick={() => setIsPopupOpen(false)}
                    />
                </CardHeader>
                <div className="flex gap-2 mt-[-50px] p-6">
                    <Image
                        src="/Generic avatar.svg"
                        width={120}
                        height={120}
                        alt="Avatar logo"
                    />
                    <div className="flex flex-col justify-between">
                        <div></div>
                        <p className="text-white text-2xl italic">
                            @hugeburger
                        </p>
                    </div>
                </div>
                <CardContent className="flex flex-col flex-grow text-2xl">
                    <main className="flex bg-primary flex-grow rounded-3xl justify-center items-center">
                        <form
                            onSubmit={handleSubmit((data) => onSubmit(data))}
                            className="text-2xl w-full p-8 flex flex-col gap-4 h-full"
                        >
                            <div className="flex flex-col flex-grow">
                                <span className="text-white text-sm font-bold">
                                    USERNAME*
                                </span>
                                <div className="flex w-full items-center">
                                    <Controller
                                        name="username"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Username"
                                                className="flex-grow text-white text-3xl h-16"
                                            />
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => onSubmit("username")}
                                        className="ml-2 bg-[#313131] text-xl py-8 px-12"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                                <span className="text-white text-sm font-bold">
                                    EMAIL*
                                </span>
                                <div className="flex w-full items-center">
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Email"
                                                className="flex-grow text-white text-3xl h-16"
                                            />
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            onSubmit("email");
                                        }}
                                        className="ml-2 bg-[#313131] text-xl py-8 px-12"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow">
                                <span className="text-white text-sm font-bold">
                                    PASSWORD*
                                </span>
                                <div className="flex w-full items-center">
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Password"
                                                className="flex-grow text-white text-3xl h-16"
                                            />
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            onSubmit("password");
                                        }}
                                        className="ml-2 bg-[#313131] text-xl py-8 px-12"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </main>
                </CardContent>
            </Card>
        </div>
    );
}
