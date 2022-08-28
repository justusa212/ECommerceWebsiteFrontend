import { useState } from 'react';
import { ProductCard } from '@/components/index';
import getGoogleOAuthURL from '@/lib/getGoogleUrl';
import products from 'products';
import useSwr from 'swr';
import fetcher from '@/lib/fetcher';
import Link from 'next/link';
import axios from 'axios';
import router from 'next/router';

export default function Home({fallbackData}) {
  const [disabled, setDisabled] = useState(false);

  const { data } = useSwr(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );

const onSubmit = async () => {
    try {
      await axios.delete( `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,{
        withCredentials: true,
      })
      data = null
      router.push('/')
    } catch (e) {
      console.log(e);
    }
  }

  if (data) {
    return(
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
      <span c>Welcome! {data.name}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            disabled={disabled}
            onClickAdd={() => setDisabled(true)}
            onAddEnded={() => setDisabled(false)}
            {...product}
          />
        ))}
      </div>
    </div>
  )}

  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
      <div>
        Please login with the options below
      </div>
      <div>
        <a href={getGoogleOAuthURL()}>Login/Register with Google</a>
      </div>
      <div>
        <Link href="/auth/login">Login Page</Link>
      </div>
      <div>
        <Link href="/auth/register">Register Page</Link>
      </div>
    </div>
  )
};


export const getServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );

  return { props: { fallbackData: data } };

};