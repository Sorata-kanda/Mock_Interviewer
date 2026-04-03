"use client";
import { z } from "zod"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {toast} from "sonner"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import FormField from "./FormField"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signUp } from "@/lib/actions/auth.action";
import {signIn} from "@/lib/actions/auth.action"

const authFormSchema = (type: FormType) =>{
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
        
    })
}

const AuthForm = ({type}: {type: FormType}) => {
    //1. Define your form
    const router = useRouter();
    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    //2. Deine a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>){
        try{
            if(type === "sign-up"){
                const{ name, email, password} = values;

                const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }
                toast.success('Account created successfully. Please sign in.');
                router.push('/sign-in');
            }
            else{
                const {email,password} = values;
                const userCredentials = await signInWithEmailAndPassword(auth,email,password);
                const idToken = await userCredentials.user.getIdToken();

                if(!idToken){
                    toast.error('Sign in failed');
                    return;
                }
                const result = await signIn({
                    email,idToken
                })
                
                if(!result?.success){
                    toast.error(result?.message || 'Sign in failed');
                    return;
                }
                
                toast.success('Sign in successfully.');
                router.push('/');
            }
        }catch(error: any){
            console.log(error);
            
            // Handle Firebase Auth errors with user-friendly messages
            if(error.code === 'auth/email-already-in-use'){
                toast.error('This email is already in use. Please sign in instead.');
            } else if(error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'){
                toast.error('Invalid email or password. Please try again.');
            } else if(error.code === 'auth/weak-password'){
                toast.error('Password is too weak. Please use a stronger password.');
            } else if(error.code === 'auth/invalid-email'){
                toast.error('Invalid email address.');
            } else if(error.code === 'auth/too-many-requests'){
                toast.error('Too many failed attempts. Please try again later.');
            } else {
                toast.error('An error occurred. Please try again.');
            }
        }
    }

    const isSignIn = type === 'sign-in';

    return (
        <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form">

                {!isSignIn && (
                    <FormField 
                        control = {form.control} 
                        name="name" 
                        label = "Name" 
                        placeholder="Your Name"
                    />
                )}
                <FormField 
                        control = {form.control} 
                        name="email" 
                        label = "Email" 
                        placeholder="Your email address"
                        type="email"
                    />

                <FormField 
                        control = {form.control} 
                        name="password" 
                        label = "Password" 
                        placeholder="Enter your password"
                        type="password"
                    />
                <button className="btn" type = "submit">{isSignIn ? 'Sign in':'Create an Account'}</button>
                
            </form>
        </Form>
        <p className="text-center">
            {isSignIn ? 'Not account yet?': 'Have an account already?'}
            <Link  href={!isSignIn ? '/sign-in' : '/sign-up'} className = "font-bold text-user-primary ml-1">
                {!isSignIn ? "Sign in" : "Sign up"}
            </Link>
        </p>
      </div>
    </div>
    )
}


export default AuthForm;
