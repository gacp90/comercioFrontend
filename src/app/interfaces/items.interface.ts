export interface Items{
    "sku":                              string;
    "quantity":                         number;
    "price":                            number;
    "cost":                            number;
    "description":                      string;
    "taxes"?:                            Tax[];
}

export interface Tax {
    "tax-rate":        number;
    "tax-category"?:     string;
    "tax-amount"?:       number;
    "tax-description"?: string;
    "tax-base"?:        number;
    "base-amount"?:     number;
}