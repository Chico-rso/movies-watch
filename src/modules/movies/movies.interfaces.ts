import { Request } from "express";

export interface SerachRequest extends Request
{
	query:
		{
			searchTerm: string;
		}
}
