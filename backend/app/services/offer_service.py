from typing import List
from app.repositories.account_repo import AccountRepository
from app.repositories.credit_card_repo import CardRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.loan_repo import LoanRepository
from app.repositories.transaction_repo import TransactionRepository
from app.schemas.offers import OfferRecommendationResponse, PersonalizedOffer


class OfferRecommendationService:
    def __init__(
        self,
        customer_repo: CustomerRepository,
        account_repo: AccountRepository,
        card_repo: CardRepository,
        loan_repo: LoanRepository,
        transaction_repo: TransactionRepository,
    ):
        self.customer_repo = customer_repo
        self.account_repo = account_repo
        self.card_repo = card_repo
        self.loan_repo = loan_repo
        self.transaction_repo = transaction_repo

    async def get_personalized_offers(self, customer_id: int) -> OfferRecommendationResponse:
        customer = await self.customer_repo.get_by_id(customer_id)
        credit_score = customer.credit_score if customer else 720
        monthly_income = customer.monthly_income if customer else 80000.0

        # Existing cards and loans
        cards = await self.card_repo.get_by_customer_id(customer_id)
        loans = await self.loan_repo.get_by_customer_id(customer_id)
        accounts = await self.account_repo.get_by_customer_id(customer_id)
        liquid_balance = sum(a.balance for a in accounts if a.status == "active")

        # Top spending categories
        top_cats = await self.transaction_repo.get_category_breakdown(customer_id)
        top_cat_names = [cat[0].lower() for cat in top_cats[:3]]

        offers: List[PersonalizedOffer] = []

        # 1. Credit Card Offers based on credit score & spend
        if credit_score >= 750:
            if any("shop" in c for c in top_cat_names):
                offers.append(
                    PersonalizedOffer(
                        id="offer-card-cashback-pro",
                        product_type="credit_card",
                        title="Millennia Cashback Platinum Card",
                        description="Tailored for your frequent shopping expenses with 5% accelerated cashback on Flipkart, Amazon & Myntra.",
                        benefits=[
                            "5% cashback on Flipkart, Amazon & online platforms",
                            "1% cashback on all offline spends",
                            "Complimentary domestic airport lounge access (4/year)",
                            "Zero joining fee for pre-approved customers",
                        ],
                        interest_rate_or_rewards="5% Cashback / 1.99% per month APR",
                        eligibility_status="Pre-Approved",
                    )
                )
            if credit_score >= 780:
                offers.append(
                    PersonalizedOffer(
                        id="offer-card-infinia-travel",
                        product_type="credit_card",
                        title="Regalia Gold Travel & Lifestyle Card",
                        description="Premium travel privileges, flight milestone vouchers, and complimentary international lounge passes.",
                        benefits=[
                            "4 reward points per ₹150 spent",
                            "Priority Pass membership with 6 international lounge visits",
                            "Low forex markup of 2.0%",
                        ],
                        interest_rate_or_rewards="Up to 3.3% reward rate",
                        eligibility_status="Recommended",
                    )
                )

        # 2. Pre-Approved Loan Offers
        total_loan_emi = sum(l.monthly_emi for l in loans if l.status == "active")
        dti = (total_loan_emi / monthly_income) * 100 if monthly_income > 0 else 0.0

        if credit_score >= 740 and dti < 35:
            pre_approved_amount = round(min(1500000.0, monthly_income * 12), -4)
            offers.append(
                PersonalizedOffer(
                    id="offer-loan-preapproved-personal",
                    product_type="personal_loan",
                    title=f"Pre-Approved Personal Loan up to ₹{pre_approved_amount:,.0f}",
                    description="Instant disbursal in 10 seconds directly to your savings account with zero paperwork and attractive interest rates.",
                    benefits=[
                        "Zero physical documentation required",
                        "Flexible tenure from 12 to 60 months",
                        "No prepayment charges after 12 EMIs",
                    ],
                    interest_rate_or_rewards="Special rate: 10.49% p.a. reducing",
                    eligibility_status="Pre-Approved",
                )
            )

        # 3. Investment Offers if high liquid balance
        if liquid_balance > 150000:
            offers.append(
                PersonalizedOffer(
                    id="offer-inv-high-yield-fd",
                    product_type="fixed_deposit",
                    title="Smart High-Yield Fixed Deposit (7.65% p.a.)",
                    description=f"Your savings account holds ₹{liquid_balance:,.0f}. Move surplus funds to earn guaranteed higher interest.",
                    benefits=[
                        "7.65% interest rate for 444-day tenure",
                        "Instant overdraft facility up to 90% without breaking FD",
                        "Auto-sweep facility available",
                    ],
                    interest_rate_or_rewards="7.65% per annum guaranteed",
                    eligibility_status="Recommended",
                )
            )

        return OfferRecommendationResponse(
            customer_id=customer_id,
            customer_credit_score=credit_score,
            recommendations=offers,
        )
