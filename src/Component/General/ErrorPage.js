import { useRouteError } from "react-router-dom";

export default function ErrorPage(){
    const err=useRouteError();
    return(
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-6 offset-md-3">
                    <h1>Opps!</h1>
                    <p>Sorry , an unexepted error has occurred.</p>
                    <p>
                        <em className="text-error">{err.statusText || err.message}</em>
                    </p>
                </div>
            </div>
        </div>
    )
}