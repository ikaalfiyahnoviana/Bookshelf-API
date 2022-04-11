const { nanoid } = require('nanoid');
const books = require('./books');

// add book
const addBookHandler = (request, h) => {
  const { 
    name, 
    year, 
    author,
    summary, 
    publisher,
    pageCount, 
    readPage, 
    reading, 
  } = request.payload;
    
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // tidak menginput name
  if (!name) {
    const response = h.response({     
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // menginput readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({     
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name, 
    year, 
    author, 
    summary, 
    publisher, 
    pageCount, 
    readPage, 
    finished, 
    reading, 
    insertedAt, 
    updatedAt,
  };

  books.push(newBook); 
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  // jika berhasil dimasukkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // jika gagal karena alasan umum 
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// get all book
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // jika tidak ada query
  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // jika ada query name
  if (name) {
    const filterBooksName = books.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: filterBooksName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // jika ada query reading
  if (reading) {
    const filterBooksReading = books.filter((book) => Number(book.reading) === Number(reading));

    const response = h.response({
      status: 'success',
      data: {
        books: filterBooksReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // query finished
  const filterBooksFinished = books.filter((book) => Number(book.finished) === Number(finished));

  const response = h.response({
    status: 'success',
    data: {
      books: filterBooksFinished.map((book) => ({     
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// get detail book
const getDetailBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  // jika id buku ditemukan
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // jika id buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// edit book
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
    
  const { 
    name, 
    year, 
    author,
    summary, 
    publisher,
    pageCount, 
    readPage, 
    reading, 
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  // tidak menginput name
  if (!name) {
    const response = h.response({     
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // menginput readPage lebih dari pageCount
  if (readPage > pageCount) {
    const response = h.response({     
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    // berhasil diperbarui
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // gagal diperbarui karena id tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// delete book
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    // berhasil dihapus
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // gagal menghapus karena id tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler, 
};