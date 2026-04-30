export type SchemaFieldType =
	| "boolean"
	| "number"
	| "string"
	| "enum"
	| "object"
	| "array";

export interface FieldSchema {
	path: string;
	label: string;
	type: SchemaFieldType;
	enumValues?: string[];
	group?: string;
	fields?: FieldSchema[];
	description?: string;
	min?: number;
	max?: number;
	step?: number;
	multiline?: boolean;
}
