// components/TeamMember.tsx

type TeamMemberType = {
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  imageSrc: string;
};

interface TeamMemberProps {
  member: TeamMemberType;
}

export function TeamMember({ member }: TeamMemberProps) {
  const { name, title, bio, email, linkedin, imageSrc } = member;
  
  return (
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="h-64 overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          class="w-full h-full object-cover"
        />
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">
          {name}
        </h3>
        <p class="text-sm text-indigo-600 mb-4">
          {title}
        </p>
        <p class="text-gray-600 mb-4">
          {bio}
        </p>
        <div class="space-y-2">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href={`mailto:${email}`}
              class="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              {email}
            </a>
          </div>
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <a
              href={linkedin}
              target="_blank"
              class="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              {linkedin.replace('https://www.', '')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}