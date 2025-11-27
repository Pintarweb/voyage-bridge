'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function ApprovalPending() {
    const { language } = useLanguage()

    const t = {
        'en-US': {
            title: 'Verification Pending',
            desc: 'Thank you for registering your agency. Our team is currently reviewing your license details.',
            nextTitle: 'What happens next?',
            step1: 'We verify your license number with local authorities.',
            step2: 'This process typically takes 24-48 hours.',
            step3: 'You will receive an email once approved.',
            returnHome: 'Return to Home'
        },
        'zh-CN': {
            title: '验证待定',
            desc: '感谢您注册您的代理机构。我们的团队目前正在审核您的执照详细信息。',
            nextTitle: '接下来会发生什么？',
            step1: '我们会向当地政府核实您的执照号码。',
            step2: '此过程通常需要 24-48 小时。',
            step3: '一旦获得批准，您将收到一封电子邮件。',
            returnHome: '返回首页'
        },
        'ms-MY': {
            title: 'Pengesahan Belum Selesai',
            desc: 'Terima kasih kerana mendaftarkan agensi anda. Pasukan kami sedang menyemak butiran lesen anda.',
            nextTitle: 'Apa yang berlaku seterusnya?',
            step1: 'Kami mengesahkan nombor lesen anda dengan pihak berkuasa tempatan.',
            step2: 'Proses ini biasanya mengambil masa 24-48 jam.',
            step3: 'Anda akan menerima e-mel setelah diluluskan.',
            returnHome: 'Kembali ke Laman Utama'
        },
        'es-ES': {
            title: 'Verificación Pendiente',
            desc: 'Gracias por registrar su agencia. Nuestro equipo está revisando actualmente los detalles de su licencia.',
            nextTitle: '¿Qué sucede después?',
            step1: 'Verificamos su número de licencia con las autoridades locales.',
            step2: 'Este proceso suele tardar entre 24 y 48 horas.',
            step3: 'Recibirá un correo electrónico una vez aprobado.',
            returnHome: 'Volver al Inicio'
        },
        'fr-FR': {
            title: 'Vérification en attente',
            desc: 'Merci d\'avoir enregistré votre agence. Notre équipe examine actuellement les détails de votre licence.',
            nextTitle: 'Que se passe-t-il ensuite ?',
            step1: 'Nous vérifions votre numéro de licence auprès des autorités locales.',
            step2: 'Ce processus prend généralement 24 à 48 heures.',
            step3: 'Vous recevrez un e-mail une fois approuvé.',
            returnHome: 'Retour à l\'accueil'
        },
        'de-DE': {
            title: 'Überprüfung ausstehend',
            desc: 'Vielen Dank für die Registrierung Ihrer Agentur. Unser Team überprüft derzeit Ihre Lizenzdetails.',
            nextTitle: 'Was passiert als Nächstes?',
            step1: 'Wir überprüfen Ihre Lizenznummer bei den örtlichen Behörden.',
            step2: 'Dieser Vorgang dauert in der Regel 24-48 Stunden.',
            step3: 'Sie erhalten eine E-Mail, sobald Sie genehmigt wurden.',
            returnHome: 'Zurück zur Startseite'
        },
        'ja-JP': {
            title: '確認待ち',
            desc: '代理店のご登録ありがとうございます。現在、チームがライセンスの詳細を確認しています。',
            nextTitle: '次はどうなりますか？',
            step1: '現地の当局にライセンス番号を確認します。',
            step2: 'このプロセスには通常24〜48時間かかります。',
            step3: '承認されるとメールが届きます。',
            returnHome: 'ホームに戻る'
        },
        'ko-KR': {
            title: '확인 대기 중',
            desc: '에이전시를 등록해 주셔서 감사합니다. 현재 저희 팀이 귀하의 라이센스 세부 정보를 검토하고 있습니다.',
            nextTitle: '다음 단계는 무엇입니까?',
            step1: '현지 당국에 라이센스 번호를 확인합니다.',
            step2: '이 과정은 보통 24-48시간이 소요됩니다.',
            step3: '승인되면 이메일을 받게 됩니다.',
            returnHome: '홈으로 돌아가기'
        },
        'ar-SA': {
            title: 'التحقق معلق',
            desc: 'شكراً لتسجيل وكالتك. يقوم فريقنا حالياً بمراجعة تفاصيل الترخيص الخاص بك.',
            nextTitle: 'ماذا يحدث بعد ذلك؟',
            step1: 'نتحقق من رقم الترخيص الخاص بك مع السلطات المحلية.',
            step2: 'تستغرق هذه العملية عادةً 24-48 ساعة.',
            step3: 'ستتلقى بريداً إلكترونياً بمجرد الموافقة.',
            returnHome: 'العودة إلى الصفحة الرئيسية'
        },
        'th-TH': {
            title: 'รอการตรวจสอบ',
            desc: 'ขอบคุณที่ลงทะเบียนหน่วยงานของคุณ ทีมงานของเรากำลังตรวจสอบรายละเอียดใบอนุญาตของคุณ',
            nextTitle: 'จะเกิดอะไรขึ้นต่อไป?',
            step1: 'เราตรวจสอบหมายเลขใบอนุญาตของคุณกับหน่วยงานท้องถิ่น',
            step2: 'กระบวนการนี้มักใช้เวลา 24-48 ชั่วโมง',
            step3: 'คุณจะได้รับอีเมลเมื่อได้รับการอนุมัติ',
            returnHome: 'กลับสู่หน้าหลัก'
        },
        'vi-VN': {
            title: 'Đang chờ xác minh',
            desc: 'Cảm ơn bạn đã đăng ký đại lý của mình. Nhóm của chúng tôi hiện đang xem xét chi tiết giấy phép của bạn.',
            nextTitle: 'Điều gì xảy ra tiếp theo?',
            step1: 'Chúng tôi xác minh số giấy phép của bạn với chính quyền địa phương.',
            step2: 'Quá trình này thường mất 24-48 giờ.',
            step3: 'Bạn sẽ nhận được email sau khi được chấp thuận.',
            returnHome: 'Trở về Trang chủ'
        },
        'id-ID': {
            title: 'Verifikasi Tertunda',
            desc: 'Terima kasih telah mendaftarkan agensi Anda. Tim kami saat ini sedang meninjau detail lisensi Anda.',
            nextTitle: 'Apa yang terjadi selanjutnya?',
            step1: 'Kami memverifikasi nomor lisensi Anda dengan otoritas setempat.',
            step2: 'Proses ini biasanya memakan waktu 24-48 jam.',
            step3: 'Anda akan menerima email setelah disetujui.',
            returnHome: 'Kembali ke Beranda'
        }
    }

    const content = t[language as keyof typeof t] || t['en-US']

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{content.title}</h1>
                <p className="text-lg text-muted-foreground">
                    {content.desc}
                </p>
                <div className="bg-card p-6 rounded-lg border border-border text-left shadow-sm">
                    <p className="text-sm font-medium text-foreground mb-2">{content.nextTitle}</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                        <li>{content.step1}</li>
                        <li>{content.step2}</li>
                        <li>{content.step3}</li>
                    </ul>
                </div>
                <div className="pt-4">
                    <Link href="/" className="text-primary hover:text-primary/80 font-medium">
                        {content.returnHome}
                    </Link>
                </div>
            </div>
        </div>
    )
}
