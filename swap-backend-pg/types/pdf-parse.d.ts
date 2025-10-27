// swap-backend-pg/types/pdf-parse.d.ts
declare module "pdf-parse" {
  // callable function (the actual export)
  function pdfParse(
    data: Buffer | Uint8Array | ArrayBuffer | string,
    options?: pdfParse.Options
  ): Promise<pdfParse.Result>;

  // namespace to hold the types (no `export` keywords here)
  namespace pdfParse {
    interface Options {
      max?: number;
      version?: string;
      pagerender?(pageData: any): Promise<string> | string;
    }
    interface Result {
      numpages: number;
      numrender: number;
      info?: any;
      metadata?: any;
      version: string;
      text: string;
    }
  }

  // CommonJS-style export
  export = pdfParse;
}
