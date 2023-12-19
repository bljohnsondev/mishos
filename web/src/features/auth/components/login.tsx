import { yupResolver } from '@hookform/resolvers/yup';
import * as React from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { showError } from '@/components/notifications';
import { config } from '@/config';
import { login } from '@/lib/auth';
import { useAppStore } from '@/stores';

interface ElementProps {
  children: React.ReactNode;
}

interface LoginFormValues {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const Label = ({ children }: ElementProps) => {
  return (
    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
      {children}
    </label>
  );
};

export const Login = () => {
  const { setUser } = useAppStore();
  const navigate = useNavigate();
  const [running, setRunning] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema) as Resolver<LoginFormValues>,
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setRunning(true);
    login(values.username, values.password)
      .then(user => {
        setUser(user);
        navigate(config.homeUrl);
      })
      .catch(() => {
        setRunning(false);
        // assuming a thrown exception during login is an auth failed for now
        showError('You entered an invalid username or password');
      });
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="rounded-lg w-[400px] border border-neutral-700 bg-neutral-800 p-4 mx-3">
        <div className="text-xl font-bold text-gray-100 mb-4">Sign in to your account</div>
        <form className="w-full" onSubmit={handleSubmit(handleLogin)}>
          <fieldset className="mb-4" disabled={running}>
            <Label>Username</Label>
            <input
              id="username"
              className="w-full rounded-lg bg-neutral-600 px-3 py-2 focus:outline-none disabled:text-gray-400"
              {...register('username')}
            />
            {errors?.username && <span className="error">{errors.username.message?.toString()}</span>}
          </fieldset>
          <fieldset className="mb-6" disabled={running}>
            <Label>Password</Label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg bg-neutral-600 px-3 py-2 focus:outline-none disabled:text-gray-400"
              {...register('password')}
            />
            {errors?.password && <span className="error">{errors.password.message?.toString()}</span>}
          </fieldset>
          <button
            className="w-full bg-blue-600 disabled:bg-blue-600/[0.6] rounded-lg px-4 py-3 text-sm font-medium text-white"
            disabled={running}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};
