import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import RepliesList from './RepliesList';
import Reply from './Reply';
import { AuthContext } from '../../../contexts/AuthContext';

const mockApi = {
    getRepliesByReviewId: jest.fn(),
    createReply: jest.fn(),
    likeReply: jest.fn(),
    dislikeReply: jest.fn()
};

const mockUser = {
    _id: 'user1',
    username: 'TestUser',
    avatar: 'test-avatar.jpg'
};

const mockReplies = [
    {
        _id: 'reply1',
        content: 'First level reply',
        user: mockUser,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [
            {
                _id: 'reply2',
                content: 'Second level reply',
                user: mockUser,
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                replies: [
                    {
                        _id: 'reply3',
                        content: 'Third level reply',
                        user: mockUser,
                        createdAt: new Date().toISOString(),
                        likes: 0,
                        dislikes: 0,
                        replies: []
                    }
                ]
            }
        ]
    }
];

describe('RepliesList Component', () => {
    const defaultProps = {
        reviewId: 'review1',
        context: 'test',
        canInteract: true,
        replies: mockReplies,
        setReplies: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockApi.getRepliesByReviewId.mockResolvedValue({ data: mockReplies });
        mockApi.createReply.mockImplementation((content) => 
            Promise.resolve({ 
                data: {
                    _id: 'newReply',
                    content,
                    user: mockUser,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    dislikes: 0,
                    replies: []
                }
            })
        );
    });

    const renderWithContext = (props = {}) => {
        return render(
            <AuthContext.Provider value={{ api: mockApi, user: mockUser }}>
                <RepliesList {...defaultProps} {...props} />
            </AuthContext.Provider>
        );
    };

    it('renders nested replies correctly', async () => {
        renderWithContext();
        
        await waitFor(() => {
            expect(screen.getByText('First level reply')).toBeInTheDocument();
            expect(screen.getByText('Second level reply')).toBeInTheDocument();
            expect(screen.getByText('Third level reply')).toBeInTheDocument();
        });
    });

    it('shows correct indentation for nested replies', async () => {
        renderWithContext();
        
        await waitFor(() => {
            const replies = screen.getAllByText(/level reply/);
            expect(replies).toHaveLength(3);
            
            // Check if replies have increasing indentation
            const getIndentation = (element) => {
                const style = window.getComputedStyle(element);
                return parseInt(style.marginLeft, 10);
            };
            
            const indentations = replies.map(reply => 
                getIndentation(reply.closest('.reply'))
            );
            
            expect(indentations[1]).toBeGreaterThan(indentations[0]);
            expect(indentations[2]).toBeGreaterThan(indentations[1]);
        });
    });

    it('handles reply to reply correctly', async () => {
        renderWithContext();
        
        const newReplyContent = 'New nested reply';
        mockApi.createReply.mockResolvedValueOnce({
            data: {
                _id: 'newNestedReply',
                content: newReplyContent,
                user: mockUser,
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                replies: []
            }
        });

        await waitFor(() => {
            const secondLevelReply = screen.getByText('Second level reply');
            const replyButton = secondLevelReply.closest('.reply').querySelector('button');
            fireEvent.click(replyButton);
        });

        const textarea = screen.getByPlaceholderText(/Write a reply/i);
        fireEvent.change(textarea, { target: { value: newReplyContent } });
        
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(newReplyContent)).toBeInTheDocument();
            expect(mockApi.createReply).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: newReplyContent,
                    parentReplyId: 'reply2'
                })
            );
        });
    });

    it('updates immediately after adding a reply', async () => {
        renderWithContext();
        
        const newReplyContent = 'Immediate update test';
        mockApi.createReply.mockResolvedValueOnce({
            data: {
                _id: 'immediateReply',
                content: newReplyContent,
                user: mockUser,
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                replies: []
            }
        });

        await waitFor(() => {
            const firstLevelReply = screen.getByText('First level reply');
            const replyButton = firstLevelReply.closest('.reply').querySelector('button');
            fireEvent.click(replyButton);
        });

        const textarea = screen.getByPlaceholderText(/Write a reply/i);
        fireEvent.change(textarea, { target: { value: newReplyContent } });
        
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        // Check if the new reply appears immediately
        expect(screen.getByText(newReplyContent)).toBeInTheDocument();
    });
});
