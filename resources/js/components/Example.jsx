import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from 'primereact/button';


function Example() {
    return (
        <div className="container">
            <Button label="Submit" />
        </div>
    );
}

export default Example;

if (document.getElementById('example')) {
    const Index = ReactDOM.createRoot(document.getElementById("example"));

    Index.render(
        <React.StrictMode>
            <Example/>
        </React.StrictMode>
    )
}
