
export default function AuthLogin() {
    return (
        <form className="text-black" action='action'>
            <div className="m-3 flex">
                <button type='submit' name='action' value='google' className="border-2 border-black rounded-lg m-1">Sign in with Google</button>
                <button type='submit' name='action' value='github' className="border-2 border-black rounded-lg m-1">Sign in with Github</button>
            </div>
        </form>
    )
}