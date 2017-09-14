interface INodeProcess {
	env: {
		NODE_ENV: string;
	};
}

declare const process: INodeProcess;
declare function require(module: string): any;