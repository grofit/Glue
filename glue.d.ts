interface KeyedBinding {
	To(model: any);
}

declare class Glue {
	Bind(key: string) : KeyedBinding;
	Unbind(key: string);
	Get(key: string);
}