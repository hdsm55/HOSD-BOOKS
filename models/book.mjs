import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';

dotenv.config(); // تحميل متغيرات البيئة من ملف .env

// إعداد الاتصال بقاعدة البيانات باستخدام متغيرات البيئة
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// تعريف الوظائف الأساسية


findAll()
const findById = async (id) => {
    const res = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return res.rows[0];
};

const create = async (book) => {
    const { title, author, cover_url, notes, rating } = book;
    await pool.query(
        'INSERT INTO books (title, author, cover_url, notes, rating) VALUES ($1, $2, $3, $4, $5)',
        [title, author, cover_url, notes, rating]
    );
};

const update = async (id, book) => {
    const { title, author, cover_url, notes, rating } = book;
    await pool.query(
        'UPDATE books SET title = $1, author = $2, cover_url = $3, notes = $4, rating = $5 WHERE id = $6',
        [title, author, cover_url, notes, rating, id]
    );
};

const deleteBook = async (id) => {
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
};

// تصدير الوظائف
export { findAll, findById, create, update, deleteBook };
