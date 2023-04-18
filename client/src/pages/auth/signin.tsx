import { signIn, getProviders } from 'next-auth/react';
import Image from 'next/image';

export default function signin({ providers }: any) {
    return (
        <div className="flex justify-center mt-20">
            <Image
                className="hidden object cover md:w-44 md:h-80 md:inline-flex"
                src="https://www.abe.bo/wp-content/uploads/2020/04/lanzamientoABE-scaled.jpg"
                alt="ABE Satellite"
            />
            <div>
                {Object.values(providers).map((provider) => (
                    <div
                        className="flex flex-col items-center"
                        key={provider.name}
                    >
                        <Image
                            className="object-cover w-36 h-36"
                            src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                            alt="ABE Logo"
                        />
                        <p className="my-10 text-sm italic text-center">
                            Sistema de Operaciones Comercial
                        </p>
                        <button
                            className="p-3 text-white bg-gray-400 rounded-lg hover:bg-gray-500"
                            onClick={() =>
                                signIn(provider.id, { callbackUrl: '/' })
                            }
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return { props: { providers } };
}
