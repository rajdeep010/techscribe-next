/**
 * Single source of truth for the brand's contact details.
 * Update values here and every page/email/footer picks up the change.
 */
export const CONTACT_INFO = {
    brandName: "Assignment Consultants",
    supportEmail: "rajdeepmallick010@gmail.com",
    adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || "support@assignmentconsultants.com",
    phoneDisplay: "+91 81677 42311",
    phoneHref: "tel:+918167742311",
    whatsappDisplay: "+91 81677 42311",
    whatsappNumber: "+918167742311",
    get whatsappLink() {
        return `https://wa.me/${this.whatsappNumber}`;
    },
    website: "https://www.assignmentconsultants.com",
    workingHours: "24/7 (Mon – Sun)",
} as const;
