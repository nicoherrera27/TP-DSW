import {useState} from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState ({
        username:'',
        password:'',
        name:'',
        surname:'',
        email:'',
        birthdate:''
    })

    const [message, setMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target
        setFormData({...formData, [name]:value})
    }

    const handleSumbit = async(e: React.FormEvent) => {
        e.preventDefault()

        try{
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json()
            console.log('data:',data)
            console.log('response:',res)
            if (res.ok){
                setMessage('Usuario registrado con éxito')
                setFormData({
                    username:'',
                    password:'',
                    name:'',
                    surname:'',
                    email:'',
                    birthdate:''
                })
            }
            else{
                setMessage(`Error: ${data.message}`)
            }
        }
        catch(err){
            setMessage('Error al conectar al server')
        }
    };
    return(
        <form onSubmit={handleSumbit}>
            <input type="text" name='username' placeholder='Nombre de usuario' value={formData.username} onChange={handleChange} required />
            <input type="text" name='password' placeholder='Contraseña' value={formData.password} onChange={handleChange} required />
            <input type="text" name='name' placeholder='Nombre' value={formData.name} onChange={handleChange} required />
            <input type="text" name='surname' placeholder='Apellido' value={formData.surname} onChange={handleChange} required />
            <input type="text" name='email' placeholder='E-Mail' value={formData.email} onChange={handleChange} required />
            <input type="text" name='birthdate' placeholder='Fecha de nacimiento' value={formData.birthdate} onChange={handleChange} required />
            
            <button type="submit">Registrarse</button>
            {message && <p> {message}  </p>}
        </form>
    );
};

export default RegisterForm;