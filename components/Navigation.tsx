import { Partial } from "$fresh/runtime.ts";
import { Button } from "../components/Button.tsx";

export default function Navigation() {
    return (
        <body>
            <aside class="flex flex-col items-center justify-center">    
                <a href="/publications" >
                    <Button >
                        Publications
                    </Button>
                </a>
                <a href="/projects" >
                    <Button>
                        Projects
                    </Button>
                </a>
                <a href="/contact" >
                    <Button>
                        Contact
                    </Button>
                </a>
            </aside>
        </body>
    );
}