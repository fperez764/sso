import { signIn, getProviders } from 'next-auth/react';

export default function signin({ providers }: any) {
    return (
        <div className="flex justify-center mt-20">
            <img
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
                        <img
                            className="w-36 object-cover"
                            src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                            alt="ABE Logo"
                        />
                        <p className="text-center text-sm italic my-10">
                            Sistema de Operaciones Comercial
                        </p>
                        <button
                            className="bg-gray-400 rounded-lg p-3 text-white hover:bg-gray-500"
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
