import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { findAll, findById, create, update, deleteBook, fetchBookDetails } from './models/book.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعداد EJS كتمبليت
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// إعداد مجلد الملفات الثابتة (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// إعداد body parser للتعامل مع بيانات النموذج
app.use(express.urlencoded({ extended: true }));

// المسارات

// الصفحة الرئيسية - عرض قائمة الكتب
app.get('/', async (req, res) => {
    try {
        const books = await findAll();
        res.render('index', { books });
    } catch (err) {
        console.error(err);
        res.send('خطأ في جلب البيانات');
    }
});

// صفحة إضافة كتاب جديد - عرض النموذج
app.get('/add-book', (req, res) => {
    res.render('add-book');
});

// معالجة إضافة كتاب جديد
app.post('/add-book', async (req, res) => {
    const { title, author, isbn, notes, rating } = req.body;
    try {
        const bookDetails = await fetchBookDetails(isbn);
        const coverUrl = bookDetails.cover ? bookDetails.cover.medium : null;
        await create({ title, author, cover_url: coverUrl, notes, rating });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('خطأ في إضافة الكتاب');
    }
});

// صفحة تفاصيل الكتاب
app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await findById(id);
        res.render('book-details', { book });
    } catch (err) {
        console.error(err);
        res.send('خطأ في جلب تفاصيل الكتاب');
    }
});

// صفحة تعديل الكتاب - عرض النموذج
app.get('/books/:id/edit', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await findById(id);
        res.render('edit-book', { book });
    } catch (err) {
        console.error(err);
        res.send('خطأ في جلب تفاصيل الكتاب للتعديل');
    }
});

// معالجة تعديل الكتاب
app.post('/books/:id/edit', async (req, res) => {
    const { id } = req.params;
    const { title, author, coverUrl, notes, rating } = req.body;
    try {
        await update(id, { title, author, cover_url: coverUrl, notes, rating });
        res.redirect(`/books/${id}`);
    } catch (err) {
        console.error(err);
        res.send('خطأ في تعديل الكتاب');
    }
});

// صفحة حذف الكتاب - عرض التأكيد
app.get('/books/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        const book = await findById(id);
        res.render('delete-book', { book });
    } catch (err) {
        console.error(err);
        res.send('خطأ في جلب تفاصيل الكتاب للحذف');
    }
});

// معالجة حذف الكتاب
app.post('/books/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteBook(id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('خطأ في حذف الكتاب');
    }
});

// تشغيل الخادم
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
