"use client";

// import dataProviderSimpleRest from "@refinedev/simple-rest";

// const API_URL = "https://api.fake-rest.refine.dev";

// export const dataProvider = dataProviderSimpleRest(API_URL);
import { DataProvider } from "@refinedev/core";
import { prisma } from "@/libs/prisma";

export const dataProvider: DataProvider = {
    getList: async ({ resource, pagination, filters, sorters }) => {
        const current = pagination?.current || 1;
        const pageSize = pagination?.pageSize || 10;

        const data = await prisma[resource].findMany({
            skip: (current - 1) * pageSize,
            take: pageSize,
            where: {
                // Transform filters to Prisma where clause
                ...(filters?.reduce((acc, filter) => ({
                    ...acc,
                    [filter.field]: filter.operator === 'eq' ? filter.value : {
                        [filter.operator]: filter.value
                    }
                }), {}) || {})
            },
            orderBy: sorters?.map(sorter => ({
                [sorter.field]: sorter.order.toLowerCase()
            }))
        });

        const total = await prisma[resource].count();

        return {
            data,
            total,
        };
    },

    getOne: async ({ resource, id }) => {
        const data = await prisma[resource].findUnique({
            where: { id: id as string },
        });

        return {
            data,
        };
    },

    create: async ({ resource, variables }) => {
        const data = await prisma[resource].create({
            data: variables,
        });

        return {
            data,
        };
    },

    update: async ({ resource, id, variables }) => {
        const data = await prisma[resource].update({
            where: { id: id as string },
            data: variables,
        });

        return {
            data,
        };
    },

    deleteOne: async ({ resource, id }) => {
        const data = await prisma[resource].delete({
            where: { id: id as string },
        });

        return {
            data,
        };
    },
    getApiUrl: function (): string {
        throw new Error("Function not implemented.");
    }
};