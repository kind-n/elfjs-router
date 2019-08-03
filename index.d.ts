// Type definitions for elfjs-router v2.0
// Project: https://www.elfjs.org/
// Definitions by: Wu Hu <https://github.com/kind-n>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.6


import * as Elf from "elfjs";

declare module "elfjs" {

    export namespace router {

        function register (...routes: Route[]): void;

        function navigate (path: string): Elf.Promise<any>;

        class RouterView implements Elf.IComponent {
            readonly props: any;
            readonly state: any;
            readonly refs: any;
            render (): JSX.Element;
        }

        class RouterLink implements Elf.IComponent {
            readonly props: RouterLinkProps;
            readonly state: any;
            readonly refs: any;
            render (): JSX.Element;
        }

        interface RouterLinkProps extends JSX.DOMProps<HTMLAnchorElement> {
            href: string;
        }
    }

    interface Route {
        readonly path: string;
        readonly component: (params: any) => Elf.ComponentConstructor | Elf.Promise<Elf.ComponentConstructor>;
    }
}

export = Elf;