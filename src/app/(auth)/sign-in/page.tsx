"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useDebounceValue } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";

export default function page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [debouncedUsername] = useDebounceValue(username, 3000);
    const { toast } = useToast();
    const router = useRouter();


    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });


    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');

                try {
                    const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
                    setUsernameMessage(response.data.message);
                }
                catch (error) {
                    console.error("err in checking username :: ", error);
                    const axiosError = error as AxiosError<ApiResponse>;

                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                }
                finally {
                    setIsCheckingUsername(false);
                }
            }
        };

        checkUsernameUnique();

    }, [debouncedUsername]);

    return (
        <>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        {isCheckingUsername  && <p>Checking...</p>}
        {usernameMessage && <p>{usernameMessage}</p>}
        </>
    );
}
