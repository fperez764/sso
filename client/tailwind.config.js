/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily:{
            body:['Fira Sans']
        },
        extend:{
            colors:{
                blue:{
                    100:'#ccdef0',
                    200:'#99bde0',
                    300:'#669cd1',
                    400:'#337bc1',
                    500:'#005ab2',
                    500:'#00488e',
                    40:'#00366b',
                    60:'#002447',
                    80:'#001224',
                }
            }
        }
    },
    plugins: [require('@tailwindcss/forms')],
};
