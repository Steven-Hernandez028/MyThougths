import { getAuthenticatedUser } from "@/lib/auth/middleware";
import { getDataSource } from "@/lib/db/data-source";
import { UserBookNotification } from "@/lib/entities/UserBookNotification";
import { Book } from "@/lib/entities/Book";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser(req);
    if (!currentUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { bookId } = await req.json();

    if (!bookId) {
      return new Response("Missing bookId", { status: 400 });
    }

    const dataSource = await getDataSource();
    const notificationRepo = dataSource.getRepository(UserBookNotification);
    const bookRepo = dataSource.getRepository(Book);

    const book = await bookRepo.findOne({ where: { id: bookId } });
    if (!book) {
      return new Response("Book not found", { status: 404 });
    }

    let relation = await notificationRepo.findOne({
      where: {
        user: { id: currentUser.id },
        book: { id: bookId },
      },
      relations: {
        user: true,
        book: true,
      },
    });

    if (!relation) {
      relation = notificationRepo.create({
        user: currentUser,
        book,
        receiveNotifications: true,
      });

      await notificationRepo.save(relation);

      return Response.json({
        created: true,
        receiveNotifications: true,
      });
    }

    relation.receiveNotifications = !relation.receiveNotifications;
    await notificationRepo.save(relation);

    return Response.json({
      updated: true,
      receiveNotifications: relation.receiveNotifications,
    });

  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAuthenticatedUser(req);
    if (!currentUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const dataSource = await getDataSource();
    const notificationRepo = dataSource.getRepository(UserBookNotification);

    const subscriptions = await notificationRepo.find({
      where: {
        user: { id: currentUser.id },
        receiveNotifications: true,
      },
      relations: {
        book: true,
      },
    });

    const books = subscriptions.map((record) => ({
      id: record.book.id,

    }));

    return Response.json(books) ;
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}