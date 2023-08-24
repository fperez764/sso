import Feed from '@src/components/trece/Feed';

const Home = () => (
  <section className='flex-col w-full flex-center'>
    <h1 className='text-xl font-bold text-center'>
      Sistema de Soporte a las Operaciones SSO
      <br className='max-md:hidden' />
      <span className='text-center orange_gradient'> Tickets</span>
    </h1>
    <p className='text-center desc'>
      Nueva interface con NextJS 13.4
    </p>
    <Feed />
  </section>
);

export default Home;
