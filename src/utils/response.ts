import { Response } from 'express';

export const ok = (res: Response, data: any) => {
  res.status(200).json(data);
};

export const created = (res: Response, data: any) => {
  res.status(201).json(data);
};

export const badRequest = (res: Response, message: string) => {
  res.status(400).json({
    message,
  });
};

export const unauthorized = (res: Response, message: string) => {
  res.status(401).json({
    message,
  });
};

export const forbidden = (res: Response, message: string) => {
  res.status(403).json({
    message,
  });
};

export const notFound = (res: Response, message: string) => {
  res.status(404).json({
    message,
  });
};

export const conflict = (res: Response, message: string) => {
  res.status(409).json({
    message,
  });
};

export const internalServerError = (res: Response, message: string) => {
  res.status(500).json({
    message,
  });
};
