import {Pool} from 'pg';
import {Application} from "express";

export type Inventory = {
    app: Application;
    pool: Pool;
}

export type InventoryResponse = {
    message: string;
    status: number;
    value: any;
    pages?: number;
    count?: number;
}

export type AuthKey = {
    key: string;
    timestamp: number;
}

export type FilterObject = {
    filters : any[];
    preArgument : String;
};