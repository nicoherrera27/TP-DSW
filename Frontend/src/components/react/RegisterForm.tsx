import { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState ({
        username:'',
        password:'',
        confirmPassword: '',
        name:'',
        surname:'',
        email:'',
        birthdate:''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    // Iconos SVG
    const eyeIcon = ( <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#555"> <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/> </svg> );
    const eyeOffIcon = ( <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#555"> <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/> </svg> );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setFormData({...formData, [name]:value});
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsError(false);
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setMessage('Error: Passwords do not match.');
            setIsError(true);
            return;
        }

        const { password } = formData;

        if (password.length < 8) {
            setMessage('Error: Password must be at least 8 characters long.');
            setIsError(true);
            return;
        }

        const hasUpperCase = /[A-Z]/.test(password);
        if (!hasUpperCase) {
            setMessage('Error: Password must contain at least one uppercase letter.');
            setIsError(true);
            return;
        }

        const hasNumber = /\d/.test(password); // \d representa que tiene que ir un numero 0-9
        if (!hasNumber) {
            setMessage('Error: Password must contain at least one number.');
            setIsError(true);
            return;
        }

        try{
            const res = await fetch('http://localhost:3000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok){
                setMessage('User registered successfully!');
                setIsError(false);
                setFormData({ username:'', password:'', confirmPassword: '', name:'', surname:'', email:'', birthdate:'' });
            } else {
                setMessage(`Error: ${data.message}`);
                setIsError(true);
            }
        } catch(err){
            setMessage('Server connection error');
            setIsError(true);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="register-form">
            <h1>Create account</h1>
            <input type="text" name='username' placeholder='Username' value={formData.username} onChange={handleChange} required autoComplete="username" />

            <div className="password-wrapper">
                <input 
                    type={showPassword ? "text" : "password"} 
                    name='password' 
                    placeholder='Password' 
                    value={formData.password} 
                    onChange={handleChange} 
                    required
                    autoComplete="new-password" 
                />
                <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                    {showPassword ? eyeOffIcon : eyeIcon}
                </button>
            </div>

            <div className="password-wrapper">
                <input 
                    type={showPassword ? "text" : "password"} 
                    name='confirmPassword' 
                    placeholder='Confirm Password' 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    required
                    autoComplete="new-password" 
                />
                <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
                    {showPassword ? eyeOffIcon : eyeIcon}
                </button>
            </div>

            <input type="text" name='name' placeholder='Name' value={formData.name} onChange={handleChange} required autoComplete="given-name" />
            <input type="text" name='surname' placeholder='Surname' value={formData.surname} onChange={handleChange} required autoComplete="family-name" />
            <input type="email" name='email' placeholder='E-Mail' value={formData.email} onChange={handleChange} required autoComplete="email" />
            <input type="date" name='birthdate' placeholder='Birthdate' value={formData.birthdate} onChange={handleChange} required autoComplete="bday" />

            <button type="submit">Register</button>

            {message && (<p className={`register-message ${isError ? 'error' : 'success'}`}>{message}</p>)}
        </form>
    );
};

export default RegisterForm;