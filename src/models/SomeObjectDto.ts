interface SomeObject {
    number: number;
    code: number;
    value: string;
}

export interface SomeObjectDto {
    hasNext: boolean,
    hasPrevious: boolean,
    items: SomeObject[],
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPages: number,
}
