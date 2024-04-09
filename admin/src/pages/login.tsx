import Form from "../components/form"
import Card from "../components/card"
import Link from "../router/link"
import Guest from "../components/wrapper"

function Input({ ...props }: any) {
    return <input {...props} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
}

function Label({ children, ...props }: any) {
    return <label {...props} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{children}</label>
}

function Button({ children, ...props }: any) {
    return <button {...props} className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{children}</button>
}

export default function Login() {
    return <Guest>
        <Card title="Login">

            <Form action="/login">
                <div>
                    <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</Label>
                    <Input type="email" name="email" id="email" placeholder="test@test.test" required />
                </div>
                <div>
                    <Label htmlFor="password">Your password</Label>
                    <Input className="test" type="password" name="password" id="password" placeholder="••••••••" required />
                </div>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="remember" aria-describedby="remember" name="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="ml-3 text-sm">
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Link to="/forget" className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500">Lost Password?</Link>
                </div>
                <Button type="submit">Login to your account</Button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Not registered? <Link to="/register" className="text-primary-700 hover:underline dark:text-primary-500">Create account</Link>
                </div>
            </Form>
        </Card>
    </Guest>

}